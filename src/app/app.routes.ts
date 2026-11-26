import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { WorkPage } from './pages/work.page';
import { CaseStudyPage } from './pages/case-study.page';
import { AboutPage, ContactPage, EducationPage, ExperiencePage, SkillsPage } from './pages/sections.pages';
import { MusicPage, ShippingPage } from './pages/live.pages';

const suffix = ' · Yahya Berbeche';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Yahya Berbeche — Software Engineer' },
  { path: 'work', component: WorkPage, title: 'Work' + suffix },
  { path: 'work/:id', component: CaseStudyPage }, // title set by the page itself.
  { path: 'experience', component: ExperiencePage, title: 'Experience' + suffix },
  { path: 'about', component: AboutPage, title: 'About' + suffix },
  { path: 'skills', component: SkillsPage, title: 'Skills' + suffix },
  { path: 'education', component: EducationPage, title: 'Education' + suffix },
  { path: 'shipping', component: ShippingPage, title: 'Shipping' + suffix },
  { path: 'music', component: MusicPage, title: 'Music' + suffix },
  { path: 'contact', component: ContactPage, title: 'Contact' + suffix },
  { path: '**', redirectTo: '' }
];
