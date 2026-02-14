import './SectionCard.scss';

interface SectionCardProps {
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export function SectionCard({ title, icon, isOpen, onToggle, children }: SectionCardProps) {
    return (
        <div className={`section-card${isOpen ? ' section-card--open' : ''}`}>
            <div className="section-card__header" onClick={onToggle}>
                <div className="section-card__title">
                    <span className="icon">{icon}</span>
                    {title}
                </div>
                <span className="section-card__chevron">▼</span>
            </div>
            {isOpen && <div className="section-card__body">{children}</div>}
        </div>
    );
}
