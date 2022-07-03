import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { INotes } from './notes.model';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Notes') private readonly notesModel: Model<INotes>,
  ) {}

  async insertNote(payload: CreateNoteDto) {
    const createdNote = new this.notesModel(payload);
    const result = await createdNote.save();
    return result.id;
  }

  async getNotes() {
    const notes = await this.notesModel.find();
    return notes;
  }

  async getNote(id: string) {
    const note = await this.notesModel.findById(id);
    return note;
  }

  async updateNote(id: string, payload: UpdateNoteDto) {
    const updatedNote = await this.notesModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }

    return updatedNote;
  }

  async deleteNote(id: string) {
    const deletedNote = await this.notesModel.findByIdAndRemove(id);
    return deletedNote;
  }
}
