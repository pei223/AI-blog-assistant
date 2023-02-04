export const debugLog = (message?: any, ...optionalParams: any[]) => {
    if (import.meta.env.MODE !== "production") {
        console.log(message, ...optionalParams)
    }
}

export const errorLog =(message?: any, ...optionalParams: any[]    ) => {
    console.error(message, ...optionalParams)
}