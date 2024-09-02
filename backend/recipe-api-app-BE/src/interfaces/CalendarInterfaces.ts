export interface EventToDatabase {
    start?: Date | string;
    end?: Date | string;
    userEmail?: string ;
    recipeId?: string;
    isDraggable?: boolean;
    isResizable?: boolean;
    resourceId?: number;
}

export interface DeletedEvent {
    userEmail: string;
    recipeId: string;
    start: Date | string;
    end: Date | string;
}