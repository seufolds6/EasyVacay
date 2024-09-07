import { api_key } from './api_key.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', generatePlan);

async function generatePlan() {
  const destination = document.getElementById('destination').value;
  const duration = document.getElementById('duration').value;
  const focus = document.getElementById('focus').value;
  const number_people = document.getElementById('number-people').value;

  const prompt = `Plan a vacation which is strictly ${duration} days long 
    in ${destination}. Focus the vacation on ${focus}, and customize
    it based on how the vacation is for ${number_people} people.
    
    Give the output in this format:
    One sentence enthusiastically wishing them a wonderful vacation.
    Day 1: Fly in
    Day 2: First landmark + brief description of the landmark
    Day 3: First restaurant + brief description of the restaurant
    ...
    `

    const output = document.getElementById('output');

    try {
      const genAI = new GoogleGenerativeAI(api_key);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); 
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      output.textContent = "The pdf with the vacation plan has been downloaded!";
      createPDF(text);
    } catch (error) {
      output.textContent = 'There is an error relating to your API key.';
    }
}

function createPDF(content) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 150);
  doc.text(lines, 12, 12);
  doc.save('EasyVacay_plan.pdf');
}
