import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "De Jure Academy";
    const category = searchParams.get("category") || "Law Education";
    const width = parseInt(searchParams.get("width")) || 1200;
    const height = parseInt(searchParams.get("height")) || 630;

    // Create a professional branded image like Shikho
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { 
                margin: 0; 
                padding: 0; 
                font-family: 'Inter', sans-serif;
            }
            .banner {
                width: ${width}px;
                height: ${height}px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #0047FF 75%, #0066FF 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            .banner::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            .logo-section {
                position: absolute;
                top: 30px;
                right: 30px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .logo-icon {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
            }
            .logo-text {
                color: white;
                font-size: 20px;
                font-weight: 700;
            }
            .content {
                text-align: center;
                z-index: 2;
                position: relative;
            }
            .category-badge {
                background: rgba(255,255,255,0.15);
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 20px;
                display: inline-block;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            .title {
                color: white;
                font-size: 42px;
                font-weight: 800;
                text-align: center;
                margin-bottom: 15px;
                text-shadow: 0 4px 8px rgba(0,0,0,0.3);
                line-height: 1.2;
                max-width: 800px;
            }
            .subtitle {
                color: rgba(255,255,255,0.9);
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 30px;
                max-width: 600px;
            }
            .academy-name {
                position: absolute;
                bottom: 30px;
                left: 30px;
                color: rgba(255,255,255,0.8);
                font-size: 16px;
                font-weight: 600;
            }
            .decorative-elements {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
                border: 2px solid rgba(255,255,255,0.1);
                border-radius: 50%;
                z-index: 1;
            }
            .decorative-elements::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 50%;
            }
        </style>
    </head>
    <body>
        <div class="banner">
            <div class="logo-section">
                <div class="logo-icon">⚖️</div>
                <div class="logo-text">De Jure Academy</div>
            </div>
            
            <div class="decorative-elements"></div>
            
            <div class="content">
                <div class="category-badge">${category}</div>
                <div class="title">${title}</div>
                <div class="subtitle">বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম</div>
            </div>
            
            <div class="academy-name">De Jure Academy</div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating social image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
