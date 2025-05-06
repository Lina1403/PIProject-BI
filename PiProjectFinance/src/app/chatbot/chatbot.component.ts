import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service';  // Importer le service
// Importer le service

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userInput: string = '';
  chatMessages: { sender: string, message: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}  // Injection du service

  // Méthode pour gérer l'envoi du message
  sendMessage() {
    if (this.userInput.trim()) {
      const inputMessage = this.userInput;  // Sauvegarde de l'entrée de l'utilisateur avant réinitialisation
      this.chatMessages.push({ sender: 'user', message: inputMessage });
      this.userInput = '';  // Réinitialise le champ de saisie

      // Appeler la méthode du service pour envoyer la question
      this.chatbotService.sendQuestion(inputMessage).subscribe(
        data => {
          this.chatMessages.push({ sender: 'bot', message: data.response });
        },
        error => {
          console.error('Error:', error);
          this.chatMessages.push({ sender: 'bot', message: 'Sorry, something went wrong.' });
        }
      );
    }
  }

  // Méthode pour gérer l'appui sur la touche "Enter"
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
