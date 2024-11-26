export interface ICultivo{
    id: number;
    nombre_cultivo: string;
    siglas_cultivo: string;
    requerimiento_suelo: string;
    estado: number;
    variedad: number;
    codigo_codificado: number;
    get_nombre_variedad: string;
}