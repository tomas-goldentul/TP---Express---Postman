export class Alumno {
constructor(username, DNI, edad){
    this.username = username;
    this.DNI = DNI;
    this.Edad = edad;
}
toString() {
 return this.username;   
}
}