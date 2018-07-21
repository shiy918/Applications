import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

const Loading= () => (
  <div className='Loader'>
    <Segment>
      <Dimmer active>
        <Loader size='huge'>Loading</Loader>
      </Dimmer>

      <Image src='/images/wireframe/short-paragraph.png' />
    </Segment>
  </div>
)

export default Loading;
