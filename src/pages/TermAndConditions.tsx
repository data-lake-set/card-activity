import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { Loading } from '../components/loading/Loading';
import { PDF_LOADING_DELAY } from '../constants/commons';
import terms from './../assets/documents/Data_Lake_Regulamin.pdf';
import { useState } from 'react';

export const TermsAndConditions = () => {
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
        setTimeout(() => {
            setIsLoading(false);
        }, PDF_LOADING_DELAY);
    }
    return (
        <>
            {isLoading && <Loading />}
            <Document file={terms} onLoadSuccess={onDocumentLoadSuccess}>
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
