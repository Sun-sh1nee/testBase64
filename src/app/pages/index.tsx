import { useState, useEffect } from "react";

interface Image {
    id: number;
    name: string;
    base64: string;
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<Image[]>([]);

    const handleUpload = async () => {
        if (!file) return alert("เลือกไฟล์ก่อน!");

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result as string;
            await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: file.name, base64 }),
            });

            fetchImages();
        };
    };

    const fetchImages = async () => {
        const res = await fetch("/api/getImages");
        const data: Image[] = await res.json();
        setImages(data);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload}>อัปโหลด</button>

            <div>
                {images.map((img) => (
                    <img key={img.id} src={img.base64} alt={img.name} width="200" />
                ))}
            </div>
        </div>
    );
}
