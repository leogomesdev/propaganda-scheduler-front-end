import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { Schedule } from '../../../interfaces/schedule';
import { Image } from 'src/app/interfaces/image';
import { ImagesApiService } from 'src/app/services/api/images-api.service';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.css'],
})
export class DialogScheduleComponent implements OnInit {
  public minDate: Date = this.yesterday();
  public defaultTime = [5, 50, 0];
  public enableMeridian = true;
  public touchUi = true;
  actionButtonName = 'Save';
  @ViewChild('picker') picker!: string;

  scheduleForm!: FormGroup;

  imagesList: Image[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: Schedule,
    private formBuilder: FormBuilder,
    private scheduleApiService: SchedulesApiService,
    private imagesApiService: ImagesApiService,
    private dialogRef: MatDialogRef<DialogScheduleComponent>,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.scheduleForm = this.formBuilder.group({
      scheduledAt: ['', Validators.required],
      imageId: ['', Validators.required],
    });

    if (this.editData?._id?.length > 0) {
      this.scheduleForm.controls['scheduledAt'].setValue(
        this.editData.scheduledAt
      );
      this.scheduleForm.controls['imageId'].setValue(this.editData.image._id);
      this.actionButtonName = 'Update';
    }

    this.getImagesForSelect();
  }

  getImagesForSelect() {
    // @TODO drop subscriptions on destroying
    this.imagesApiService.getAll().subscribe((data: Image[]) => {
      this.imagesList = data.sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      );
    });
  }

  addOrUpdateSchedule(closeFormAfterSaving = true) {
    if (this.editData?._id?.length > 0) {
      return this.updateSchedule(closeFormAfterSaving);
    }

    return this.addSchedule(closeFormAfterSaving);
  }

  addSchedule(closeFormAfterSaving: boolean) {
    if (!this.scheduleForm.valid) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const scheduleData = new CreateScheduleDto(
      this.scheduleForm.value['scheduledAt'],
      this.scheduleForm.value['imageId']
    );
    this.scheduleApiService.create(scheduleData).subscribe({
      next: () => {
        this.messageService.showSuccess('Schedule created successfully', 5);
        this.scheduleForm.controls['scheduledAt'].reset();
        if (closeFormAfterSaving) {
          this.dialogRef.close('SAVE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || error.message;
        this.messageService.showError(
          'Error while creating schedule',
          errorMessage,
          10
        );
      },
    });
  }

  updateSchedule(closeFormAfterSaving: boolean) {
    if (!this.scheduleForm.valid) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const scheduleData = new CreateScheduleDto(
      this.scheduleForm.value['scheduledAt'],
      this.scheduleForm.value['imageId']
    );
    this.scheduleApiService.update(scheduleData, this.editData._id).subscribe({
      next: () => {
        this.messageService.showSuccess('Schedule updated successfully', 5);
        this.scheduleForm.reset();
        if (closeFormAfterSaving) {
          this.dialogRef.close('UPDATE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || [error.message];
        this.messageService.showError(
          'Error while updating schedule',
          errorMessage,
          10
        );
      },
    });
  }

  yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
  }
}
