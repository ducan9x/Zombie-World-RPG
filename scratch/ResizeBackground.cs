using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class BackgroundProcessor
{
    public static void ResizeImage(string srcPath, string destPath, int targetW, int targetH)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            using (Bitmap target = new Bitmap(targetW, targetH, PixelFormat.Format24bppRgb))
            {
                using (Graphics g = Graphics.FromImage(target))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    g.DrawImage(src, new Rectangle(0, 0, targetW, targetH));
                }

                target.Save(destPath);
                Console.WriteLine(string.Format("Successfully saved resized image {0}x{1} to {2}", targetW, targetH, destPath));
            }
        }
    }
}

