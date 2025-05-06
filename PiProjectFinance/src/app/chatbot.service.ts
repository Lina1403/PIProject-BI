import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl: string = 'http://localhost:5000/ask-question';  // URL de ton backend Flask

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer la question et récupérer la réponse du chatbot
  sendQuestion(userInput: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, { user_input: userInput });
  }
}
