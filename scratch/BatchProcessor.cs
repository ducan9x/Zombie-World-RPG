using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class BatchProcessor
{
    public static void ProcessAsset(string srcPath, string destPath, int targetW, int targetH, bool isLightBg, int tolerance)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            using (Bitmap fullPng = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                bool[,] isBg = new bool[w, h];
                Queue<Point> queue = new Queue<Point>();

                // Sample border colors
                List<Color> borderSamples = new List<Color>();
                for (int x = 0; x < w; x += 20)
                {
                    borderSamples.Add(src.GetPixel(x, 0));
                    borderSamples.Add(src.GetPixel(x, h - 1));
                }
                for (int y = 0; y < h; y += 20)
                {
                    borderSamples.Add(src.GetPixel(0, y));
                    borderSamples.Add(src.GetPixel(w - 1, y));
                }

                int avgR = 0, avgG = 0, avgB = 0;
                foreach (Color c in borderSamples)
                {
                    avgR += c.R;
                    avgG += c.G;
                    avgB += c.B;
                }
                avgR /= borderSamples.Count;
                avgG /= borderSamples.Count;
                avgB /= borderSamples.Count;
                int avgBrightness = (avgR + avgG + avgB) / 3;

                Func<Color, bool> isBgPixel = (c) =>
                {
                    int b = (c.R + c.G + c.B) / 3;
                    int maxDiff = Math.Max(Math.Abs(c.R - c.G), Math.Max(Math.Abs(c.R - c.B), Math.Abs(c.G - c.B)));

                    if (isLightBg)
                    {
                        // Light background: checkerboard or light studio (brightness >= 170, low saturation)
                        return (b >= 170 && maxDiff <= 30) || (b >= 210);
                    }
                    else
                    {
                        // Dark background: black or dark gray studio
                        // Check distance to border avg
                        int dist = (int)Math.Sqrt((c.R - avgR) * (c.R - avgR) + (c.G - avgG) * (c.G - avgG) + (c.B - avgB) * (c.B - avgB));
                        return dist <= tolerance || (b <= avgBrightness + 15 && maxDiff <= 25);
                    }
                };

                // Seed from all 4 borders
                for (int x = 0; x < w; x++)
                {
                    Color top = src.GetPixel(x, 0);
                    if (isBgPixel(top)) { isBg[x, 0] = true; queue.Enqueue(new Point(x, 0)); }
                    Color bottom = src.GetPixel(x, h - 1);
                    if (isBgPixel(bottom)) { isBg[x, h - 1] = true; queue.Enqueue(new Point(x, h - 1)); }
                }
                for (int y = 0; y < h; y++)
                {
                    Color left = src.GetPixel(0, y);
                    if (isBgPixel(left) && !isBg[0, y]) { isBg[0, y] = true; queue.Enqueue(new Point(0, y)); }
                    Color right = src.GetPixel(w - 1, y);
                    if (isBgPixel(right) && !isBg[w - 1, y]) { isBg[w - 1, y] = true; queue.Enqueue(new Point(w - 1, y)); }
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
                            if (isBgPixel(nc))
                            {
                                isBg[nx, ny] = true;
                                queue.Enqueue(new Point(nx, ny));
                            }
                        }
                    }
                }

                // Copy pixels with transparency and feathered boundary
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
                                if (isLightBg)
                                {
                                    int b = (c.R + c.G + c.B) / 3;
                                    int alpha = Math.Max(0, Math.Min(255, (255 - b) * 3));
                                    fullPng.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                                }
                                else
                                {
                                    int dist = (int)Math.Sqrt((c.R - avgR) * (c.R - avgR) + (c.G - avgG) * (c.G - avgG) + (c.B - avgB) * (c.B - avgB));
                                    int alpha = Math.Max(0, Math.Min(255, dist * 3));
                                    fullPng.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                                }
                            }
                            else
                            {
                                fullPng.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                            }
                        }
                    }
                }

                // Downscale to target size
                using (Bitmap target = new Bitmap(targetW, targetH, PixelFormat.Format32bppArgb))
                {
                    using (Graphics g = Graphics.FromImage(target))
                    {
                        g.Clear(Color.Transparent);
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.DrawImage(fullPng, new Rectangle(0, 0, targetW, targetH));
                    }

                    target.Save(destPath, ImageFormat.Png);
                    Console.WriteLine(string.Format("Processed {0} -> {1}x{2} PNG at {3}", srcPath, targetW, targetH, destPath));
                }
            }
        }
    }
}

