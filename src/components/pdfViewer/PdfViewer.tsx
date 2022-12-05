import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { Loading } from '../loading/Loading';
import { PDF_LOADING_DELAY } from '../../constants/commons';
import { useState } from 'react';

type Props = {
    file: string;
};

export const PdfViewer = ({ file }: Props) => {
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }: any) => {
        setNumPages(numPages);
        setTimeout(() => {
            setIsLoading(false);
        }, PDF_LOADING_DELAY);
    };
    return (
        <>
            {isLoading && <Loading />}
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="flex justify-center"
                    />
                ))}
            </Document>
        </>
    );
};
