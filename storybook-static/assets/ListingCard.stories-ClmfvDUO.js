import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{L as a}from"./ListingCard-CSh2GMS3.js";import"./Badge-DEuHeGQz.js";import"./index-DwQS_Y10.js";import"./heart-YVLjfoYM.js";import"./createLucideIcon-Dn7aSrF3.js";const F={title:"Patterns/ListingCard",component:a,tags:["autodocs"],parameters:{layout:"padded",docs:{description:{component:"Listing card from Figma 293-4354. Variations: default, with guest favorite chip, heart saved. Structure: image, title · year, price · rating, heart icon (toggles red), optional chip."}}},decorators:[s=>e.jsx("div",{style:{maxWidth:320},children:e.jsx(s,{})})],argTypes:{title:{control:"text"},year:{control:"text"},price:{control:"text"},rating:{control:"text"},date:{control:"text"},isGuestFavorite:{control:"boolean"},defaultLiked:{control:"boolean"},onClick:{action:"clicked"}}},r={args:{id:"card-1",image:"https://placehold.co/320x248",title:"Cleopatra's Palace Suite — Alexandria",year:"30 BC",price:"$600 / hour",rating:"4.92"}},t={args:{id:"card-2",image:"https://placehold.co/320x248",title:"Ancient Rome Villa",year:"44 BC",price:"$800 / hour",rating:"4.97",isGuestFavorite:!0}},i={args:{id:"card-3",image:"https://placehold.co/320x248",title:"Ancient Rome Villa",year:"44 BC",price:"$800 / hour",rating:"4.97",defaultLiked:!0},parameters:{docs:{description:{story:"Heart in saved (red) state."}}}},o={parameters:{layout:"fullscreen",docs:{description:{story:"Grid of card variations from Figma 293-4354."}}},decorators:[s=>e.jsx("div",{style:{padding:24},children:e.jsx(s,{})})],render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:24},children:[e.jsx(a,{id:"g1",image:"https://placehold.co/320x248",title:"Cleopatra's Palace Suite — Alexandria",year:"30 BC",price:"$600 / hour",rating:"4.92"}),e.jsx(a,{id:"g2",image:"https://placehold.co/320x248",title:"Ancient Rome Villa",year:"44 BC",price:"$800 / hour",rating:"4.97",isGuestFavorite:!0}),e.jsx(a,{id:"g3",image:"https://placehold.co/320x248",title:"Mars Olympus Base Camp",year:"2187",price:"$1,200 / hour",rating:"4.88",defaultLiked:!0}),e.jsx(a,{id:"g4",image:"https://placehold.co/320x248",title:"Neo-Tokyo Capsule Pod",year:"2087",price:"$400 / hour",date:"Mar 15-20"})]})};var d,c,l;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    id: 'card-1',
    image: 'https://placehold.co/320x248',
    title: "Cleopatra's Palace Suite — Alexandria",
    year: '30 BC',
    price: '$600 / hour',
    rating: '4.92'
  }
}`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var n,p,m;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    id: 'card-2',
    image: 'https://placehold.co/320x248',
    title: 'Ancient Rome Villa',
    year: '44 BC',
    price: '$800 / hour',
    rating: '4.97',
    isGuestFavorite: true
  }
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var g,u,h;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(h=(u=i.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var x,y,C;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Grid of card variations from Figma 293-4354.'
      }
    }
  },
  decorators: [Story => <div style={{
    padding: 24
  }}>
        <Story />
      </div>],
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24
  }}>
      <ListingCard id="g1" image="https://placehold.co/320x248" title="Cleopatra's Palace Suite — Alexandria" year="30 BC" price="$600 / hour" rating="4.92" />
      <ListingCard id="g2" image="https://placehold.co/320x248" title="Ancient Rome Villa" year="44 BC" price="$800 / hour" rating="4.97" isGuestFavorite />
      <ListingCard id="g3" image="https://placehold.co/320x248" title="Mars Olympus Base Camp" year="2187" price="$1,200 / hour" rating="4.88" defaultLiked />
      <ListingCard id="g4" image="https://placehold.co/320x248" title="Neo-Tokyo Capsule Pod" year="2087" price="$400 / hour" date="Mar 15-20" />
    </div>
}`,...(C=(y=o.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};const j=["Default","WithGuestFavorite","HeartSaved","CardGridFigma2934354"];export{o as CardGridFigma2934354,r as Default,i as HeartSaved,t as WithGuestFavorite,j as __namedExportsOrder,F as default};
