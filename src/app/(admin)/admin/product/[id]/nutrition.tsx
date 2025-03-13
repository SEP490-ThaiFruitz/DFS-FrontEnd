import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import NutriontionHeader from './nutrition-header'
import NutritionFactTab, { NutritionFact } from './nutrition-fact';

export interface ProductNutrition {
    id: string;
    ingredients: string;
    servingSize: number;
    nutritionFacts: NutritionFact[];
}

interface NutritionTabProps {
    productId: string,
    productNutrion: ProductNutrition | undefined
}

const NutritionTab = ({ productNutrion, productId }: Readonly<NutritionTabProps>) => {

    return (
        <TabsContent value="nutrition">
            <Card className="w-full mx-auto">
                <NutriontionHeader id={productNutrion?.id} productId={productId} ingredients={productNutrion?.ingredients ?? ""} servingSize={productNutrion?.servingSize ?? 0} />
                <NutritionFactTab productNutritionId={productNutrion?.id} productId={productId} nutritionFacts={productNutrion?.nutritionFacts ?? []} />
            </Card>
        </TabsContent>
    )
}

export default NutritionTab