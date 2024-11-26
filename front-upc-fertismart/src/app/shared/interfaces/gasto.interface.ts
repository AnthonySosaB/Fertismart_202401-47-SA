export interface IGasto{
    id: number;
    campo: number;
    descripcion_gasto: string;
    tipo_gasto: number;
    fecha_registro: string;
    monto: string;
    observaciones: string;
    get_nombre_tipo_gasto: string;
    get_nombre_campo: string;
}