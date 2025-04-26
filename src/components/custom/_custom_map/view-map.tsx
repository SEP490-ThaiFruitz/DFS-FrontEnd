import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React from 'react'

interface ViewMapProps {
    className?: string;
    longtitude: number;
    latitude: number;
    isOpen: boolean;
    onClose: () => void;
}

function ViewMap({ longtitude, latitude, className = "h-[600px] lg:min-w-[1000px]", onClose, isOpen }: Readonly<ViewMapProps>) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn("p-0 flex flex-col", className)}>
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle>Tọa độ của bạn</DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full">
                    <iframe
                        title="Google Map"
                        src={`https://maps.google.com/maps?q=${latitude},${longtitude}&hl=vi&z=15&output=embed`}
                        className="w-full h-full"
                        loading="lazy"
                        allowFullScreen
                        style={{ border: 0 }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewMap
