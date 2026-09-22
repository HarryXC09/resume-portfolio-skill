import React from 'react';
import {profile} from '../content/profile';
import {asset} from '../lib/motion';
export default function Publication({t}) {const p=profile.publication; return <section id="publication" className="publication section"><div className="publication-heading"><h2>SELECTED WORK<span>{p.year}</span></h2></div><div className="paper"><h3>{p.title}</h3><p className="authors">{p.authors}</p><p className="meta">{p.journal}</p></div><div className="affiliations">{profile.journey.entries.filter(e=>e[5]).map((e,i)=><div key={i}><img src={asset('logos/'+e[5])} alt={t(e[2],e[1])}/><div><span className="meta">{e[1]}</span><p>{t(e[3],e[4])}</p></div></div>)}</div></section>}
