import logging
import uvicorn
from starlette.applications import Starlette
from starlette.routing import Route
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
import json
from typing import Any, Sequence, Union
import os
import asyncio
from urllib.parse import quote_plus
import httpx
from datetime import datetime

logger = logging.getLogger("sse-mcp-server")

class Weather:
    def __init__(self, locale: str = 'en', unit: str = 'imperial'):
        self.locale = locale
        self.unit = unit

    async def get_forecast(self, location: str) -> str:
        url = f'https://{self.locale}.wttr.in/{quote_plus(location)}?format=j1'
        return await self._fetch_url(url)

    async def _fetch_url(self, url: str, raw: bool = False, max_retries: int = 3) -> str:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
            'Content-Type': 'application/json'
        }

        for attempt in range(max_retries):
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(url, headers=headers)

                    # log the response
                    logging.info(f"Response status code: {response.status_code}")
                    logging.info(f"Response content: {response.text}")
                    if response.status_code == 404 and response.text:
                        self.logger.warning(f'Got 404 but received content for URL: {url}')
                        response_content = response.text
                        if not raw:
                            response_content = self._format_content(response.content, url)
                        return response_content

                    response.raise_for_status()
                    response_content = response.text

                    if not raw:
                        response_content = self._format_content(response.content, url)
                    return response_content

                except httpx.HTTPStatusError as e:
                    if attempt == max_retries - 1:
                        self.logger.error(f'HTTP error occurred: {e}')
                        raise
                    await asyncio.sleep(1 * (attempt + 1))  # exponential backoff
                except httpx.RequestError as e:
                    self.logger.error(f'Request error occurred: {e}')
                    raise
                except Exception as e:
                    self.logger.error(f'An error occurred: {e}')
                    raise

    def _format_content(self, content: Union[str, bytes], url: str) -> str:
        try:
            if isinstance(content, bytes):
                content = content.decode('utf-8')
            data = json.loads(content)
            return data
        except json.JSONDecodeError:
            self.logger.error(f"Failed to decode JSON from {url}")
            raise
        except Exception as e:
            self.logger.error(f"Error formatting content from {url}: {str(e)}")
            raise


class UserGenerator:
    """用于生成随机用户数据的类"""
    
    async def generate_user(self, gender=None, nationality=None) -> dict:
        """
        生成随机用户数据
        
        Args:
            gender: gender for the user
            
        Returns:
            包含随机用户数据的字典
        """
        # 构建 API URL
        url = "https://randomuser.me/api/"
        params = []
        
        if gender:
            params.append(f"gender={gender}")
        if nationality:
            params.append(f"nat={nationality}")
            
        if params:
            url += "?" + "&".join(params)
            
        logger.info(f"Calling Random User API: {url}")
        
        # 调用 API
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                logger.info("Successfully retrieved random user data")
                return data
            except Exception as e:
                logger.error(f"Error generating random user: {str(e)}")
                raise RuntimeError(f"Random User API error: {str(e)}")


class MCP_Server:
    def __init__(self):
        logger.debug("Initializing MCP_Server")
        self.app = Server("mcp-server")
        self.setup_tools()

    def setup_tools(self):
        @self.app.list_tools()
        async def list_tools() -> list[Tool]:
            return [
                Tool(
                    name="get_current_weather",
                    description="Get current weather and forecast for a location",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "location_name": {
                                "type": "string",
                                "description": "The location to get the weather for"
                            }
                        },
                        "required": ["location_name"]
                    }
                ),
                Tool(
                    name="create_random_user",
                    description="Generate random user data",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "gender": {
                                "type": "string",
                                "enum": ["male", "female"],
                                "description": "gender for the user"
                            }
                        },
                        "required": ["gender"]
                    }
                )
            ]

        @self.app.call_tool()
        async def call_tool(name: str, arguments: Any) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
            if name == "get_current_weather":
                if not isinstance(arguments, dict) or "location_name" not in arguments:
                    logger.error(f"Invalid weather arguments: {arguments} is not a 'dict'")
                    raise ValueError(f"Invalid weather arguments: {arguments} is not a 'dict'")

                try:
                    location_name = arguments["location_name"]
                    logger.info(f"Received weather request for location: {location_name}")
                    weather = await Weather(locale='zh-cn', unit='metric').get_forecast(location_name)
                    logger.info(f"Successfully received weather data for location")

                    return [
                        TextContent(
                            type="text",
                            text=json.dumps(weather, indent=3)
                        )
                    ]

                except Exception as e:
                    logger.error(f"Face Error processing weather request: {str(e)}")
                    raise RuntimeError(f"Weather API error: {str(e)}")
                    
            elif name == "create_random_user":
                try:
                    gender = arguments.get("gender")
                    
                    logger.info(f"Received user generation request with gender={gender}")
                    user_generator = UserGenerator()
                    user_data = await user_generator.generate_user(gender)
                    
                    return [
                        TextContent(
                            type="text",
                            text=json.dumps(user_data, indent=3)
                        )
                    ]
                except Exception as e:
                    logger.error(f"Error processing user generation request: {str(e)}")
                    raise RuntimeError(f"User generation error: {str(e)}")
            else:
                logger.error(f"Unknown tool: {name}")
                raise ValueError(f"Unknown tool: {name}")


def create_app():
    weather_server = MCP_Server()
    sse = SseServerTransport("/request")

    class HandleSSE:
        def __init__(self, sse, weather_server):
            self.sse = sse
            self.weather_server = weather_server

        async def __call__(self, scope, receive, send):
            async with self.sse.connect_sse(scope, receive, send) as streams:
                await self.weather_server.app.run(
                    streams[0],
                    streams[1],
                    self.weather_server.app.create_initialization_options()
                )

    class HandleMessages:
        def __init__(self, sse):
            self.sse = sse

        async def __call__(self, scope, receive, send):
            await self.sse.handle_post_message(scope, receive, send)

    routes = [
        Route("/sse", endpoint=HandleSSE(sse, weather_server), methods=["GET"]),
        Route("/request", endpoint=HandleMessages(sse), methods=["POST"])
    ]

    return Starlette(routes=routes)


if __name__ == "__main__":
    app = create_app()
    uvicorn.run(app, host="127.0.0.1", port=3000)