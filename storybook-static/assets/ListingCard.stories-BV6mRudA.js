import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{L as y}from"./UserMenu-zY8MeJtX.js";import"./SectionTitle-OUIKQWJq.js";import"./index-BCtMShv3.js";import"./search-De7yGF5O.js";import"./createLucideIcon-CJ_m3CD5.js";const A={title:"Patterns/ListingCard",component:y,tags:["autodocs"],parameters:{layout:"padded",docs:{description:{component:"Structure: image, title (no year in title), sub line with era/time (e.g. 306 BC) and ★ rating. Heart toggles red. Optional Guest favorite chip. Variants: default, two-line title, guest favorite, heart saved."}}},decorators:[C=>o.jsx("div",{style:{maxWidth:320},children:o.jsx(C,{})})],argTypes:{title:{control:"text"},year:{control:"text"},price:{control:"text"},rating:{control:"text"},date:{control:"text"},isGuestFavorite:{control:"boolean"},defaultLiked:{control:"boolean"},onClick:{action:"clicked"}}},e={args:{id:"card-1",image:"https://placehold.co/320x248",title:"Cleopatra's Palace Suite — Alexandria",year:"30 BC",price:"$600 / hour",rating:"4.92"}},t={args:{id:"card-two-line",image:"https://placehold.co/320x248",title:"Alexander the Great's Campaign Tent — Macedon to the Indus",year:"306 BC",price:"$600 / hour",rating:"4.88"},parameters:{docs:{description:{story:"Title wraps to two lines; sub line shows era (306 BC) and star rating."}}}},r={args:{id:"card-2",image:"https://placehold.co/320x248",title:"Ancient Rome Villa",year:"44 BC",price:"$800 / hour",rating:"4.97",isGuestFavorite:!0}},a={args:{id:"card-3",image:"https://placehold.co/320x248",title:"Ancient Rome Villa",year:"44 BC",price:"$800 / hour",rating:"4.97",defaultLiked:!0},parameters:{docs:{description:{story:"Heart in saved (red) state."}}}};var i,s,n;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    id: 'card-1',
    image: 'https://placehold.co/320x248',
    title: "Cleopatra's Palace Suite — Alexandria",
    year: '30 BC',
    price: '$600 / hour',
    rating: '4.92'
  }
}`,...(n=(s=e.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var c,d,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    id: 'card-two-line',
    image: 'https://placehold.co/320x248',
    title: "Alexander the Great's Campaign Tent — Macedon to the Indus",
    year: '306 BC',
    price: '$600 / hour',
    rating: '4.88'
  },
  parameters: {
    docs: {
      description: {
        story: 'Title wraps to two lines; sub line shows era (306 BC) and star rating.'
      }
    }
  }
}`,...(l=(d=t.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var p,m,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    id: 'card-2',
    image: 'https://placehold.co/320x248',
    title: 'Ancient Rome Villa',
    year: '44 BC',
    price: '$800 / hour',
    rating: '4.97',
    isGuestFavorite: true
  }
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,h,x;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    id: 'card-3',
    image: 'https://placehold.co/320x248',
    title: 'Ancient Rome Villa',
    year: '44 BC',
    price: '$800 / hour',
    rating: '4.97',
    defaultLiked: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Heart in saved (red) state.'
      }
    }
  }
}`,...(x=(h=a.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};const G=["Default","TwoLineTitle","WithGuestFavorite","HeartSaved"];export{e as Default,a as HeartSaved,t as TwoLineTitle,r as WithGuestFavorite,G as __namedExportsOrder,A as default};
