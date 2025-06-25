// src/jspdf-autotable.d.ts
import jsPDF from "jspdf";
import "jspdf-autotable";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (...args: any[]) => jsPDF;
  }
}