import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { BlogService } from 'src/apis/blog/blog.service';
import { IBlog, ITimer } from 'src/interfaces/models';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private cronJobs: Map<string, CronJob> = new Map();

  constructor(private blogService: BlogService) {}

  createCronJob(blog: IBlog) {
    // Check exist , if exist then clear
    if (this.cronJobs.has(blog._id)) {
      this.cronJobs.get(blog._id)?.stop(); // Dừng cron job cũ
      this.cronJobs.delete(blog._id);
    }

    //
    const timer = this.handleGeneratorCronTime(blog.timer);
    if (!timer) return;

    //
    const cronJob = new CronJob(
      timer,
      () => {
        this.handleCronJob(blog._id); // Gọi hàm đăng bài cho blog
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );
    this.logger.log('Handle set isPost:::', blog._id);

    this.cronJobs.set(blog._id, cronJob); // Lưu cron job vào map
    cronJob.start();
  }

  updateCronTime(blog: IBlog) {
    this.createCronJob(blog);
  }

  private async handleCronJob(id: string) {
    await this.blogService.setPostBelongTimer(id);
    this.logger.log('Handle set isPost:::', id);

    const cronJob = this.cronJobs.get(id);
    if (cronJob) {
      cronJob.stop();
      this.cronJobs.delete(id);
      this.logger.log('Deleted cron job:::', id);
    }
  }

  // private handleGeneratorCronTime(cronTime: ITimer) {
  //   const toJS = JSON.parse(cronTime as any);
  //   const value = toJS.value;

  //   const timer = {
  //     NO: '',
  //     HOURS: `${value} * * * *`,
  //     DAY: `0 ${value} * * *`,
  //     WEEK: `0 0 * * ${value}`
  //   }
  //   return timer[toJS.type] || '';
  // }
  private handleGeneratorCronTime(cronTime: ITimer) {
    const toJS = JSON.parse(cronTime as any);
    if(!toJS.date || !toJS.time) {
      return "";
    }
    const [day, month, year] = toJS.date.split('-');
    const [hours, minute] = toJS.time.split(':');
    return `* ${minute} ${hours} ${day} ${month} *`;
  }
}
