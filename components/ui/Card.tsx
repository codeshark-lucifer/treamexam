import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
    return (
        <div 
            className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "", style }: CardProps) {
    return (
        <div 
            className={`flex flex-col space-y-1.5 p-6 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className = "", style }: CardProps) {
    return (
        <h3 
            className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
            style={style}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = "", style }: CardProps) {
    return (
        <p 
            className={`text-sm text-muted-foreground ${className}`}
            style={style}
        >
            {children}
        </p>
    );
}

export function CardContent({ children, className = "", style }: CardProps) {
    return (
        <div 
            className={`p-6 pt-0 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

export function CardFooter({ children, className = "", style }: CardProps) {
    return (
        <div 
            className={`flex items-center p-6 pt-0 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
