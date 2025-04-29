import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  constructor(private http: HttpClient) {}

  getEmbedConfig(role: string): any {
    const groupId = '104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6';
    const reportId = 'de9745aa-ee3c-48b1-a96c-adb5d6051d73';
    const ctid = '604f1a96-cbe8-43f8-abbf-f8eaf5d85730';

    let embedUrl: string;

    switch(role) {
      case '1':
        embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}&autoAuth=true&ctid=${ctid}`;
        break;
      case '2':
        embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}&autoAuth=true&ctid=${ctid}&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19`;
        break;
      case '3':
        embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}&autoAuth=true&ctid=${ctid}`;
        break;
      default:
        throw new Error('Invalid user role');
    }

    return {
      type: 'report',
      embedUrl: embedUrl,
      id: reportId,
      accessToken: null, // Vous devrez implémenter la récupération du token
      tokenType: 1, // 1 = Embed
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    };
  }
}
