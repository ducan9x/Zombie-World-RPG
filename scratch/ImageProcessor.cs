using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageProcessor
{
    public static void ProcessHeart(string srcPath, string destPath, int targetSize)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            // Step 1: Create 32-bit ARGB bitmap
            using (Bitmap fullPng = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                // Determine background using BFS from edges
                bool[,] isBg = new bool[w, h];
                Queue<Point> queue = new Queue<Point>();

                // Helper to check if pixel is checkerboard
                Func<Color, bool> isCheckerColor = (c) =>
                {
                    // Checkerboard is light gray / white (e.g. R,G,B around 220-255, and low saturation)
                    int maxDiff = Math.Max(Math.Abs(c.R - c.G), Math.Max(Math.Abs(c.R - c.B), Math.Abs(c.G - c.B)));
                    int brightness = (c.R + c.G + c.B) / 3;
                    return brightness >= 180 && maxDiff <= 25;
                };

                // Seed from all 4 borders
                for (int x = 0; x < w; x++)
                {
                    Color top = src.GetPixel(x, 0);
                    if (isCheckerColor(top)) { isBg[x, 0] = true; queue.Enqueue(new Point(x, 0)); }
                    Color bottom = src.GetPixel(x, h - 1);
                    if (isCheckerColor(bottom)) { isBg[x, h - 1] = true; queue.Enqueue(new Point(x, h - 1)); }
                }
                for (int y = 0; y < h; y++)
                {
                    Color left = src.GetPixel(0, y);
                    if (isCheckerColor(left) && !isBg[0, y]) { isBg[0, y] = true; queue.Enqueue(new Point(0, y)); }
                    Color right = src.GetPixel(w - 1, y);
                    if (isCheckerColor(right) && !isBg[w - 1, y]) { isBg[w - 1, y] = true; queue.Enqueue(new Point(w - 1, y)); }
                }

                // 4-way BFS flood fill
                int[] dx = { 0, 0, 1, -1 };
                int[] dy = { 1, -1, 0, 0 };

                while (queue.Count > 0)
                {
                    Point p = queue.Dequeue();
                    for (int i = 0; i < 4; i++)
                    {
                        int nx = p.X + dx[i];
                        int ny = p.Y + dy[i];
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !isBg[nx, ny])
                        {
                            Color nc = src.GetPixel(nx, ny);
                            if (isCheckerColor(nc))
                            {
                                isBg[nx, ny] = true;
                                queue.Enqueue(new Point(nx, ny));
                            }
                        }
                    }
                }

                // Copy pixels with transparency
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        if (isBg[x, y])
                        {
                            fullPng.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        }
                        else
                        {
                            Color c = src.GetPixel(x, y);
                            // Soft edge anti-aliasing near background
                            bool nearBg = false;
                            for (int i = 0; i < 4; i++)
                            {
                                int nx = x + dx[i];
                                int ny = y + dy[i];
                                if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[nx, ny])
                                {
                                    nearBg = true;
                                    break;
                                }
                            }

                            if (nearBg)
                            {
                                int brightness = (c.R + c.G + c.B) / 3;
                                if (brightness > 160)
                                {
                                    // Feather alpha for boundary pixels
                                    int alpha = Math.Max(0, Math.Min(255, (255 - brightness) * 3));
                                    fullPng.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                                }
                                else
                                {
                                    fullPng.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                                }
                            }
                            else
                            {
                                fullPng.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                            }
                        }
                    }
                }

                // Step 2: High quality downscale to targetSize x targetSize
                using (Bitmap target = new Bitmap(targetSize, targetSize, PixelFormat.Format32bppArgb))
                {
                    using (Graphics g = Graphics.FromImage(target))
                    {
                        g.Clear(Color.Transparent);
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.DrawImage(fullPng, new Rectangle(0, 0, targetSize, targetSize));
                    }

                    target.Save(destPath, ImageFormat.Png);
                    Console.WriteLine(string.Format("Successfully saved {0}x{1} PNG to: {2}", targetSize, targetSize, destPath));
                }
            }
        }
    }
}
