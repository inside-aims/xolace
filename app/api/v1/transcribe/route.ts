import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY || '',
});

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;


    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    if (!process.env.ASSEMBLY_API_KEY) {
      console.error('ASSEMBLY_API_KEY is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the audio file to AssemblyAI
    //const uploadUrl = await client.files.upload(buffer);

    // Transcribe the audio
    const transcript = await client.transcripts.transcribe({
      audio: buffer,
      language_detection: true,
      audio_start_from: 0, // Start at the very beginning (0 milliseconds)
      audio_end_at: 180000, // End at 3 minutes (180,000 milliseconds)
    });

    if (transcript.status === 'error') {
      console.error('Transcription failed:', transcript.error);
      return NextResponse.json(
        { error: transcript.error },
        { status: 500 }
      );
    }

    const transcriptionText = transcript.text
    await client.transcripts.delete(transcript.id);

    const endTime = Date.now()
    const transcriptionTime = endTime - startTime
    console.log("Transcription time : ",transcriptionTime)

    return NextResponse.json({ text: transcriptionText, transcriptionTime });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}
