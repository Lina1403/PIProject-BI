import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBox') private chatBox!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  userInput = '';
  chatMessages: {
    text: string,
    sender: 'user' | 'bot',
    timestamp?: Date,
    confidence?: number
  }[] = [];
  isLoading = false;
  isOnline = true;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Message de bienvenue initial
    this.addBotMessage("Bonjour ! Je suis l'assistant Monoprix. Posez-moi vos questions sur nos produits, magasins ou services.");
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    const inputText = this.userInput.trim();
    if (!inputText || this.isLoading) return;

    // Ajouter le message de l'utilisateur
    this.addUserMessage(inputText);
    this.userInput = '';
    this.isLoading = true;

    // Envoyer au service
    this.chatbotService.askQuestion(inputText).subscribe({
      next: (response) => {
        this.addBotMessage(response.answer, response.confidence);
        this.isLoading = false;
      },
      error: (error) => {
        this.addBotMessage("Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.");
        console.error('Chatbot error:', error);
        this.isLoading = false;
        this.isOnline = false;
      }
    });
  }

  private addUserMessage(text: string) {
    this.chatMessages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });
  }

  private addBotMessage(text: string, confidence?: number) {
    this.chatMessages.push({
      text,
      sender: 'bot',
      timestamp: new Date(),
      confidence
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Scroll error:', err);
    }
  }

  // Gestion de la touche Entrée
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
