import { isBuildStatus } from '../build-status.js'
import { createServiceTester } from '../tester.js'
export const t = await createServiceTester()

t.create('deploy status')
  .get('/3ff11fe8457bd304.json?token=lESRN9rEFFfDq92JtXs_jw')
  .expectBadge({
    label: 'bitrise',
    message: isBuildStatus,
  })

t.create('deploy status with branch')
  .get('/3ff11fe8457bd304/master.json?token=lESRN9rEFFfDq92JtXs_jw')
  .expectBadge({
    label: 'bitrise',
    message: isBuildStatus,
  })

t.create('unknown branch')
  .get('/cde737473028420d/unknown.json?token=GCIdEzacE4GW32jLVrZb7A')
  .expectBadge({ label: 'bitrise', message: 'branch not found' })

t.create('invalid token')
  .get('/cde737473028420d/unknown.json?token=token')
  .expectBadge({ label: 'bitrise', message: 'app not found or invalid token' })

t.create('invalid App ID')
  .get('/invalid/master.json?token=GCIdEzacE4GW32jLVrZb7A')
  .expectBadge({ label: 'bitrise', message: 'app not found or invalid token' })
