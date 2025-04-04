// Example of CPU-intensive task (e.g., image processing) using multithreading and asynchronous programming in C#
// This code is intentionally suboptimal and can be optimized further.

using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

class ImageProcessingExample
{
    // Simulate a CPU-intensive image processing task
    static void ProcessImage(int imageId)
    {
        Console.WriteLine($"Start processing image {imageId} on thread {Thread.CurrentThread.ManagedThreadId}");
        double result = 0;
        for (int i = 0; i < 100000000; i++)
        {
            result += Math.Sqrt(i) * Math.Sin(i);
        }
        Console.WriteLine($"Finished processing image {imageId}, result: {result}");
    }

    // Asynchronous wrapper for the CPU-intensive task
    static async Task ProcessImageAsync(int imageId)
    {
        await Task.Run(() => ProcessImage(imageId));
    }

    static async Task Main(string[] args)
    {
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();

        // Suboptimal approach: Launch multiple tasks without considering optimal thread usage or CPU cores
        Task[] tasks = new Task[10];
        for (int i = 0; i < tasks.Length; i++)
        {
            tasks[i] = ProcessImageAsync(i);
        }

        await Task.WhenAll(tasks);

        stopwatch.Stop();
        Console.WriteLine($"Total processing time: {stopwatch.ElapsedMilliseconds} ms");
    }
}