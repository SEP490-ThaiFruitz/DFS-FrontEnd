import { AriaAttributes, DOMAttributes } from "react";
type AttributeType = SVGElement | HTMLElement | Element;

export interface ClassNameAttribute<T extends AttributeType>
  extends AriaAttributes,
    DOMAttributes<T> {
  className?: string;
}

export interface ClassName {}
