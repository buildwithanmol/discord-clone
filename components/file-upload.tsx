import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { X } from 'lucide-react'
import Image from "next/image"
interface FileUploadProps {
    onChange: (url?: string) => void,
    value: string,
    endpoint: "messageFile" | "serverImage"
}

export default function FileUpload({
    onChange, value, endpoint
}: FileUploadProps) {
    const fileType = value?.split('.').pop()

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20 ">
                <Image
                    src={value}
                    fill
                    alt="Upload"
                    className="rounded-full object-cover"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 hover:bg-rose-400 transition-all text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X  />
                </button>
            </div>
        )
    }

    return <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }
        }
        onUploadError={(error: Error) => {
            console.log(error)
        }}
    />
}