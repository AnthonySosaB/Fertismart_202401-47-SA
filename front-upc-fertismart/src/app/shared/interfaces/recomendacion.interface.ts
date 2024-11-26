export interface IRecomendacion{
    id: number;
    campo: number;
    fertilizante: number;
    fecha: string;
    fosforo: number;
    potasio: number;
    temperatura: number;
    humedad: number;
    potencial_hidrogeno: number;
    precipitacion: number;
    nitrogeno: number;
    estado_recomendacion: string;
    observacion: string;
    get_nombre_campo: string;
    get_nombre_fertilizante: string;
}