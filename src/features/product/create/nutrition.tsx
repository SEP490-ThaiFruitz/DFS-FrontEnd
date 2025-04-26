import React from "react";
import { UseFormReturn } from "react-hook-form";
import NutriontionHeader from "./create-nutrition-header";
import NutritionFact from "./create-nutrition-fact";

interface NutritionProps {
  formProduct: UseFormReturn<any>;
}

const Nutrition = ({ formProduct }: Readonly<NutritionProps>) => {
  // console.log(formProduct.formState)
  return (
    <>
      <NutriontionHeader formProduct={formProduct} />
      <NutritionFact formProduct={formProduct} />
      {formProduct.formState.errors.ingredients && (
        <div className="text-sm text-red-500 mt-1">
          {formProduct.formState.errors.ingredients.message as string}
        </div>
      )}
      {formProduct.formState.errors.servingSize && (
        <div className="text-sm text-red-500 mt-1">
          {formProduct.formState.errors.servingSize.message as string}
        </div>
      )}
      {formProduct.formState.errors.nutritionFacts && (
        <div className="text-sm text-red-500 mt-1">
          {formProduct.formState.errors.nutritionFacts.message as string}
        </div>
      )}
    </>
  );
};

export default Nutrition;
