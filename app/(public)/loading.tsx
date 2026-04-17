// app\(public)\loading.tsx
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-8 py-32 animate-pulse w-full">
            {/* Skeleton Hero Section */}
            <div className="flex flex-col md:flex-row gap-12 items-center mb-32">
                <div className="md:w-7/12 space-y-6 w-full">
                    <div className="h-6 w-40 bg-surface-container-highest rounded-full"></div>
                    <div className="h-16 w-full bg-surface-container-highest rounded-xl"></div>
                    <div className="h-16 w-3/4 bg-surface-container-highest rounded-xl"></div>
                    <div className="h-24 w-full bg-surface-container-highest rounded-xl mt-4"></div>
                    <div className="flex gap-4 mt-8">
                        <div className="h-14 w-40 bg-surface-container-highest rounded-full"></div>
                        <div className="h-14 w-40 bg-surface-container-highest rounded-full"></div>
                    </div>
                </div>
                <div className="md:w-5/12 w-full">
                    <div className="aspect-square rounded-3xl bg-surface-container-highest w-full"></div>
                </div>
            </div>

            {/* Skeleton Grid Section */}
            <div className="space-y-6">
                <div className="h-10 w-64 bg-surface-container-highest rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-surface-container-highest rounded-xl"></div>
                    <div className="h-64 bg-surface-container-highest rounded-xl"></div>
                    <div className="h-64 bg-surface-container-highest rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}