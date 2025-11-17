import type { ReactNode } from "react";

interface PropType {
    children: ReactNode;
    title: string;
    isForceTrigger?: boolean;
}
const Tooltip = ({ children, title, isForceTrigger }: PropType) => {
    return (
        <div className="relative inline-block cursor-pointer group">
            {children}
            <>
                <span
                    className="invisible group-hover:visible
                            absolute bottom-[120%] left-1/2 -translate-x-1/2
                            z-40 py-1 px-2
                            bg-black text-white text-center rounded-sm font-inter text-xs font-semibold truncate select-none"
                >
                    {title}
                </span>
                <span
                    className="invisible group-hover:visible
                            absolute bottom-[110%] left-1/2 -translate-x-1/2
                            rotate-45 rounded-sm rounded-tl-lg h-3 w-3 bg-black z-30"
                />
            </>
            {isForceTrigger && (
                <>
                    <span
                        className="absolute bottom-[120%] left-1/2 -translate-x-1/2
                            z-40 py-1 px-2
                            bg-black text-white text-center rounded-sm font-inter text-xs font-semibold truncate select-none"
                    >
                        {title}
                    </span>
                    <span
                        className="absolute bottom-[110%] left-1/2 -translate-x-1/2
                            rotate-45 rounded-sm rounded-tl-lg h-3 w-3 bg-black z-30"
                    />
                </>
            )}
        </div>
    );
};

export default Tooltip;
