import React from 'react';
import { CVPreview } from '../CVPreview';
import type { CVData } from '../../types';
import './PrintLayout.scss';

interface PrintLayoutProps {
    data: CVData;
    title?: string;
}

export const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(({ data, title }, ref) => {
    return (
        <div className="print-layout" ref={ref}>
            <CVPreview data={data} title={title} />
        </div>
    );
});

PrintLayout.displayName = 'PrintLayout';
