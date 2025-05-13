import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../utils/validate';

const prisma = new PrismaClient();
const router = Router({ mergeParams: true });

const activitySchema = z.object({
  type: z.string().min(1).max(50, 'Type must be at most 50 characters'),
  notes: z.string().optional(),
});

// POST /contacts/:contactId/activities
router.post('/', validate(activitySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactId = Number(req.params.contactId);
    // ensure contact exists
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return res.status(404).json({ status: 404, message: 'Contact not found' });
    }

    const data = (req as any).validated as z.infer<typeof activitySchema>;
    const activity = await prisma.activity.create({
      data: {
        ...data,
        contact: { connect: { id: contactId } },
        company: contact.companyId ? { connect: { id: contact.companyId! } } : undefined,
      },
    });
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
});

// GET /contacts/:contactId/activities
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactId = Number(req.params.contactId);
    const activities = await prisma.activity.findMany({
      where: { contactId },
      orderBy: { date: 'desc' },
    });
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

export default router;
