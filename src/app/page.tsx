'use client'
import { useState, useEffect } from "react";

interface Image {
    id: number;
    name: string;
    base64: string;  // ✅ ใช้ base64 เหมือนเดิม
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("เลือกไฟล์ก่อน!");
        setLoading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result as string;
            if (!base64.startsWith("data:image")) {
                setLoading(false);
                return alert("กรุณาอัปโหลดรูปภาพเท่านั้น!");
            }

            await fetch("/api/upload", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: file.name, base64 }),
            });

            setFile(null);
            fetchImages();
        };
    };

    const fetchImages = async () => {
        const res = await fetch("/api/getImages");
        const data: Image[] = await res.json();
        setImages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
            <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                accept="image/*"
            />
            <button 
                onClick={handleUpload} 
                disabled={loading} 
                style={{ marginLeft: 10 }}
            >
                {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
            </button>

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                gap: "10px", 
                marginTop: "20px" 
            }}>
                {images.map((img) => (
                    <div key={img.id} style={{ textAlign: "center" }}>
                        <img 
                            src={img.base64}  // ✅ ใช้ base64 แสดงรูป
                            alt={img.name} 
                            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                        />
                        <p style={{ fontSize: "12px", marginTop: "5px" }}>{img.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
