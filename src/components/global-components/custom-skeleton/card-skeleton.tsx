import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function CardSkeleton() {
    return (
        <Card className="cardStyle">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-28" />
            </CardContent>
        </Card>
    )
}

export default CardSkeleton