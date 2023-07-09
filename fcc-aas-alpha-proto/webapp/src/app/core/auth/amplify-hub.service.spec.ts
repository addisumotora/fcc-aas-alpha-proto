jest.mock('@angular/router');
jest.mock('aws-amplify');
import { fakeAsync, TestBed } from '@angular/core/testing';
import { AmplifyHubService } from './amplify-hub.service';
import { Hub } from 'aws-amplify';

describe('AmplifyHubService', () => {
  let service: AmplifyHubService;
  const callbackJson = {
    payload: {
      event: "cognitoHostedUI",
      data: "creds"
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(AmplifyHubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })


  it('should create', () => {
    expect(service).toBeDefined();
  })
  describe('listenForAuthEvents', () => {
    it('should notify listeners of auth events when cognitoHostedUi', fakeAsync(() => {
      Hub.listen = jest.fn().mockImplementation((auth, callback) => callback(callbackJson) as {});
      service.authEvent.subscribe(response => {
        expect(response).toBe(null);
      })
    }))
  })
});