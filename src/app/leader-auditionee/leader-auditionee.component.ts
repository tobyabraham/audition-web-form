import { Component, NgModule, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, AfterViewInit, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JudgementComponent } from '../judgement/judgement.component';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DynamicModule } from '../dynamic-module';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { MatInput, MatAutocomplete, MatSelect, MatFormField, MatButton, MatOption } from '@angular/material';
import { StudentLeadersService } from '../shared/student-leaders.service';
import { Observable } from 'rxjs/Observable';
import { AuditioneesService } from '../shared/auditionees.service';
import { Leader } from './leader';
import { Auditionee } from './auditionee';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-leader-auditionee',
  templateUrl: './leader-auditionee.component.html'
})

export class LeaderAuditioneeComponent implements AfterViewInit, OnInit {
	@ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
	public judgementList: Array<ComponentRef<JudgementComponent>> = [];
	public studentLeader: string = '';
	public auditionee: string = '';
	public auditioneeList: Array<string> = [];
	public slList: Array<string> = [];
	public newLeaders: Array<string> = [];
	public oldLeaders: Array<string> = [];
	public oldAuditionees: Array<string> = [];
	public myControl: FormControl = new FormControl();
	public filteredOptions: Observable<string[]>;

	constructor(private cfr: ComponentFactoryResolver,
							private db: AngularFireDatabase,
							private cdr: ChangeDetectorRef,
							private service: StudentLeadersService,
							private auditService: AuditioneesService) {}
	
	ngOnInit() {
		// fill student leaders list
		this.slList = this.service.getStudentLeaders();

		// fill auditionees list
		this.auditioneeList = this.auditService.getAuditionees();

		this.filteredOptions = this.myControl.valueChanges.startWith(null).map(val =>
			val ? this.filter(val) : this.auditioneeList.slice());
	}

	filter(val: string): any[] {
		return this.auditioneeList.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) == 0);
	}

	ngAfterViewInit() {
		this.putInMyHtml();
	}

	public putInMyHtml() {
		let compFactory = this.cfr.resolveComponentFactory(JudgementComponent);
		this.judgementList.push(this.target.createComponent(compFactory));
		this.cdr.detectChanges();
	}

	public newAuditionee(name) {
		for (let i = 0; i < this.auditioneeList.length; i++) {
			if (this.auditioneeList[i] === name) {
				return false;
			}
		}
		return true;
	}

	public submitComment() {
		for (var item of this.judgementList) {
			var instance = item.instance;
			const newJudgement = {
				studentLeader: this.studentLeader,
				criteria: instance.getCriteria(),
				comment: instance.getComment()
			};
			this.db.list('Trumpets/Comments/' + this.auditionee + '/' + instance.getGoodOrBad()).push(newJudgement);
		}
		if (this.newAuditionee(this.auditionee)) {
			this.db.object(`Trumpets/Auditionees/${this.auditionee}`).set(this.auditionee);
		}
		this.target.clear();
		this.judgementList = [];
		this.putInMyHtml();
	}

	public handleTyping(event : any) {
		this.newLeaders = event.target.value.split('\n');
		this.oldLeaders = event.target.value.split('\n');
		this.oldAuditionees = event.target.value.split('\n');
	}

	public addLeaders() {
		for (let i = 0; i < this.newLeaders.length; i++) {
			if (this.newLeaders[i].length === 0) {
				continue;
			}
			this.db.object(`Trumpets/Student Leaders/${this.newLeaders[i]}`).set(this.newLeaders[i]);
		}
	}

	/** In case I'm an idiot and clear the database again
Alex Konopacki
Alex Lee
Bobby Belzeski
Cassie McKee
Colin Milhaupt
JC McCaw
Jeremy Weinstock
Kristin Darling
Nick Iavagnilio
Ryan Bever
Tim Walther
Vincent Maggioli
	 */

	public removeLeaders() {
		for (let i = 0; i < this.oldLeaders.length; i++) {
			this.db.object(`Trumpets/Student Leaders/${this.oldLeaders[i]}`).remove();
		}
	}

	public removeAllLeaders() {
		this.db.object('Trumpets/Student Leaders/').remove();
	}

	public removeAuditionees() {
		for (let i = 0; i < this.oldAuditionees.length; i++) {
			this.db.object(`Trumpets/Auditionees/${this.oldAuditionees[i]}`).remove();
		}
	}

	public removeAllAuditionees() {
		this.db.object('Trumpets/Auditionees/').remove();
	}
}