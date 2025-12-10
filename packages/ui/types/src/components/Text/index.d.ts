import type { TextProps as NTextProps } from 'react-native';
interface TextProps extends NTextProps {
    className?: string;
    tx?: string;
}
export default function Text({ className, tx, children, ...props }: TextProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map