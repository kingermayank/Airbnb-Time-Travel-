import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Badge,
  Avatar,
  Divider,
  Input,
  Header,
  SearchBar,
  ListingCard,
  BookingWidget,
  VehicleCard,
  ConfirmationSummary,
} from '../design-system';
import type { EraOption } from '../design-system';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '@/design-system/patterns/Header/header-nav-assets';

const sectionStyle: React.CSSProperties = {
  marginBottom: 48,
};

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 16,
  color: 'var(--ds-text-primary)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'center',
  marginBottom: 16,
};

const DURATION_OPTIONS = [
  { value: 4, label: '4 hours', multiplier: 1 },
  { value: 8, label: '8 hours', multiplier: 2 },
];

const SAMPLE_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];
const SAMPLE_VEHICLES = [
  { id: 'delorean', name: 'DeLorean', description: 'Back to the Future.', iconUrl: 'https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/vehicles/delorean.jpg' },
  { id: 'tardis', name: 'TARDIS', description: 'Bigger on the inside.', iconUrl: 'https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/vehicles/tardis.png' },
];

export function DesignSystemShowcase() {
  const navigate = useNavigate();
  const [era, setEra] = useState<EraOption>('all');
  const [guestCount, setGuestCount] = useState(1);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [vehicle, setVehicle] = useState('delorean');

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          Back to app
        </Button>
        <Text variant="h1" color="primary">
          Design system showcase
        </Text>
      </div>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Foundations</h2>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Button</Text>
          <div style={rowStyle}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Text</Text>
          <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text variant="display" color="primary">Display</Text>
            <Text variant="h1" color="primary">Heading 1</Text>
            <Text variant="h2" color="primary">Heading 2</Text>
            <Text variant="body" color="primary">Body text</Text>
            <Text variant="bodySmall" color="secondary">Body small secondary</Text>
            <Text variant="label" color="primary">Label</Text>
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Badge</Text>
          <div style={rowStyle}>
            <Badge>Frequently revisited</Badge>
            <Badge>Pending</Badge>
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Avatar</Text>
          <div style={rowStyle}>
            <Avatar src={null} alt="User" size="sm" />
            <Avatar src={null} alt="User" size="md" />
            <Avatar src={null} alt="User" size="lg" />
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Divider</Text>
          <div style={{ width: 200 }}>
            <Divider orientation="horizontal" />
            <div style={{ display: 'flex', height: 40, alignItems: 'center' }}>
              <span>Left</span>
              <Divider orientation="vertical" />
              <span>Right</span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Input</Text>
          <div style={rowStyle}>
            <Input placeholder="Placeholder" style={{ width: 200 }} />
          </div>
        </div>
      </section>

      <Divider orientation="horizontal" />

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Patterns</h2>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>Header</Text>
          <Header
            brandName="WarpBnB"
            navItems={SAMPLE_NAV_ITEMS}
            activeNavLabel="Time Travel"
            onNavClick={() => {}}
            rightSlot={<Button variant="ghost" size="sm">Become a host</Button>}
          />
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>SearchBar</Text>
          <SearchBar
            era={era}
            onEraChange={setEra}
            geographyLabel="Search destinations"
            guestCount={guestCount}
            onGuestsChange={setGuestCount}
            onSearch={() => {}}
          />
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>ListingCard</Text>
          <div style={{ maxWidth: 280 }}>
            <ListingCard
              id="showcase-1"
              image="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg"
              title="Sample listing"
              price="₿0.019 / hour"
              rating="4.82"
              isGuestFavorite
              onClick={() => {}}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>BookingWidget</Text>
          <div style={{ maxWidth: 360 }}>
            <BookingWidget
              durationOptions={DURATION_OPTIONS}
              selectedDuration={duration}
              onDurationChange={setDuration}
              guestCount={2}
              priceDisplay="₿0.042"
              onBook={() => {}}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>VehicleCard</Text>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {SAMPLE_VEHICLES.map((v) => (
              <div key={v.id} style={{ width: 280 }}>
                <VehicleCard
                  id={v.id}
                  name={v.name}
                  description={v.description}
                  iconUrl={v.iconUrl}
                  selected={vehicle === v.id}
                  onSelect={() => setVehicle(v.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>ConfirmationSummary</Text>
          <div style={{ maxWidth: 480 }}>
            <ConfirmationSummary
              statusMessage="Your stay is pending"
              listingTitle="Sample listing"
              listingImageUrl="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg"
              durationLabel="4 hours"
              guestCount={2}
              totalDisplay="₿0.042"
              onGoHome={() => navigate('/')}
              onViewListing={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
