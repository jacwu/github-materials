import logging
import uvicorn
from starlette.applications import Starlette
from pathlib import Path
from starlette.routing import Route
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
import json
from typing import Any, Sequence, Union, Dict, TypeVar, cast
import asyncio
from urllib.parse import quote_plus
import httpx

# Create logs directory if it doesn't exist
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("logs/mcp_server.log"), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

T = TypeVar('T')

class Weather:
    def __init__(self, locale: str = 'en', unit: str = 'imperial', timeout: float = 10.0):
        self.locale = locale
        self.unit = unit
        self.timeout = timeout

    async def get_forecast(self, location: str) -> Dict[str, Any]:
        """Get weather forecast for a specified location."""
        url = f'https://{self.locale}.wttr.in/{quote_plus(location)}?format=j1'
        logger.info(f"Requesting weather data for location: {location}")
        return await self._fetch_url(url)

    async def _fetch_url(self, url: str, raw: bool = False, max_retries: int = 3) -> Dict[str, Any]:
        """Fetch data from URL with retry logic and proper error handling."""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
            'Content-Type': 'application/json'
        }

        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(url, headers=headers)
                    
                    # Log response details at debug level instead of info to avoid excessive logging
                    logger.debug(f"Response from {url}: status={response.status_code}")
                    
                    # Handle special case for 404 responses that still contain valid content
                    if response.status_code == 404 and response.text:
                        logger.warning(f'Got 404 but received content from URL: {url}')
                        return self._process_response(response, raw, url)
                    
                    # Handle other status codes
                    response.raise_for_status()
                    return self._process_response(response, raw, url)
                    
            except httpx.HTTPStatusError as e:
                if attempt == max_retries - 1:
                    logger.error(f'HTTP error occurred after {max_retries} attempts: {e}')
                    raise
                logger.warning(f'HTTP error on attempt {attempt+1}/{max_retries}: {e}. Retrying...')
                await asyncio.sleep(1 * (2 ** attempt))  # Better exponential backoff
            except httpx.RequestError as e:
                logger.error(f'Request error for {url}: {e}')
                raise
            except Exception as e:
                logger.error(f'Unexpected error fetching {url}: {e}', exc_info=True)
                raise

    def _process_response(self, response: httpx.Response, raw: bool, url: str) -> Dict[str, Any]:
        """Process HTTP response and return formatted content."""
        if raw:
            return cast(Dict[str, Any], response.text)
        return self._format_content(response.content, url)

    def _format_content(self, content: Union[str, bytes], url: str) -> Dict[str, Any]:
        """Format and parse JSON content from response."""
        try:
            if isinstance(content, bytes):
                content = content.decode('utf-8')
            return json.loads(content)
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON from {url}")
            raise ValueError(f"Invalid JSON response from weather service: {content[:100]}...")
        except Exception as e:
            logger.error(f"Error formatting content from {url}: {str(e)}")
            raise ValueError(f"Failed to process weather data: {str(e)}")


class UserGenerator:
    """Class for generating random user data"""
    
    async def generate_user(self, gender=None, nationality=None) -> dict:
        """
        Generate random user data.
        
        Args:
            gender: gender for the user
            nationality: nationality for the user
        
        Returns:
            Dictionary containing random user data
        """
        # Build API URL
        url = "https://randomuser.me/api/"
        params = []
        
        if gender:
            params.append(f"gender={gender}")
        if nationality:
            params.append(f"nat={nationality}")
            
        if params:
            url += "?" + "&".join(params)
            
        logger.info(f"Calling Random User API: {url}")
        
        # Call API
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
    myserver = MCP_Server()
    sse = SseServerTransport("/request")

    class HandleSSE:
        def __init__(self, sse, myserver):
            self.sse = sse
            self.myserver = myserver

        async def __call__(self, scope, receive, send):
            async with self.sse.connect_sse(scope, receive, send) as streams:
                await self.myserver.app.run(
                    streams[0],
                    streams[1],
                    self.myserver.app.create_initialization_options()
                )

    class HandleMessages:
        def __init__(self, sse):
            self.sse = sse

        async def __call__(self, scope, receive, send):
            await self.sse.handle_post_message(scope, receive, send)

    routes = [
        Route("/sse", endpoint=HandleSSE(sse, myserver), methods=["GET"]),
        Route("/request", endpoint=HandleMessages(sse), methods=["POST"])
    ]

    return Starlette(routes=routes)


if __name__ == "__main__":
    app = create_app()
    uvicorn.run(app, host="127.0.0.1", port=3000)