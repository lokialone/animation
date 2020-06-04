import React, {useState, useEffect} from 'react';
interface Props {
    path?: string;
}

const FileUpload = (props: Props) => {
    const [src, setSrc] = useState<string>('');
    const fileOnload = (e: any) => {
        const file = e.target.files[0];
        const r = URL.createObjectURL(file);
        setSrc(r);
        // URL.revokeObjectURL(r);
    };
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(src);
        };
    });
    return (
        <>
            <input type="file" onChange={fileOnload} />
            <div>{src && <img src={src}></img>}</div>
        </>
    );
};

export default FileUpload;
