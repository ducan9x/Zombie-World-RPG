using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class PerfectBackpackProcessor
{
    public static void Process(string srcPath, string destPath, int targetSize)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            using (Bitmap fullPng = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                // Background color in ui_icon_backpack_1793856377410.jpg is dark studio slate:
                // Corner (0,0) is R=27, G=27, B=27
                // Backpack itself is olive-drab green (G > R, or distinct texture) or brown leather/canvas

                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        Color c = src.GetPixel(x, y);

                        // A pixel is background if it's very dark neutral gray/black:
                        // R, G, B around 20-35, with very low saturation (R, G, B very close to each other)
                        int maxDiff = Math.Max(Math.Abs(c.R - c.G), Math.Max(Math.Abs(c.R - c.B), Math.Abs(c.G - c.B)));
                        int brightness = (c.R + c.G + c.B) / 3;

                        bool isBg = (brightness <= 35 && maxDiff <= 7) || (brightness <= 28 && maxDiff <= 10);

                        if (isBg)
                        {
                            fullPng.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        }
                        else
                        {
                            // Check if near background for smooth anti-aliasing
                            bool nearBg = false;
                            int[] dx = { 0, 0, 1, -1 };
                            int[] dy = { 1, -1, 0, 0 };

                            for (int i = 0; i < 4; i++)
                            {
                                int nx = x + dx[i];
                                int ny = y + dy[i];
                                if (nx >= 0 && nx < w && ny >= 0 && ny < h)
                                {
                                    Color nc = src.GetPixel(nx, ny);
                                    int nDiff = Math.Max(Math.Abs(nc.R - nc.G), Math.Max(Math.Abs(nc.R - nc.B), Math.Abs(nc.G - nc.B)));
                                    int nBright = (nc.R + nc.G + nc.B) / 3;
                                    if ((nBright <= 35 && nDiff <= 7) || (nBright <= 28 && nDiff <= 10))
                                    {
                                        nearBg = true;
                                        break;
                                    }
                                }
                            }

                            if (nearBg && brightness <= 50)
                            {
                                int alpha = Math.Max(0, Math.Min(255, (brightness - 25) * 10));
                                fullPng.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                            }
                            else
                            {
                                fullPng.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                            }
                        }
                    }
                }

                // High Quality Bicubic Resize to targetSize x targetSize
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
                    Console.WriteLine(string.Format("Successfully saved clean 256x256 backpack to: {0}", destPath));
                }
            }
        }
    }
}

