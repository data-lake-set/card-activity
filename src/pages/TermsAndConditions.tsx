import { PdfViewer } from '../components/pdfViewer/PdfViewer';
import terms from './../assets/documents/DATA_RIVER_TERMS_AND_CONDITIONS.pdf';

export const TermsAndConditions = () => <PdfViewer file={terms} />;
