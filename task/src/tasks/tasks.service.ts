import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { Task } from './task.model';
import {TaskStatus}  from  './task.model';
const uuid = require('uuid').v4

@Injectable()
export class TasksService {
    private  tasks: Task[] = [];   //private array  

    getAllTasks(): Task[] {

        return this.tasks;
        //return ('string');
    }

    getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const {status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status){
            tasks = tasks.filter(task =>task.status === status);
        }
        if(search){
            tasks = tasks.filter(task =>
            task.title.includes(search) ||
            task.description.includes(search),
               );
        }
        return tasks;

    }

    getTaskById(id: string): Task{
      const found = this.tasks.find(task => task.id === id );

      if(!found){
          throw new NotFoundException(`Task not found ${id}`);
      }
      return found;
    }
    createTask(createTaskDto: CreateTaskDto): Task {

        const {title, description } = createTaskDto;

        const task: Task ={
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }
    
    deleteTask(id:string) {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTaskStatus(id:string, status:TaskStatus):Task  {
        const task = this.getTaskById(id);
        task.status = status;
        return task;

            }
        
   
    }

