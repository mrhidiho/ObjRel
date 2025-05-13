import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../utils/validate';
import activityRouter from './activity';

const prisma = new PrismaClient();
const router = Router();

// ------------------ Schema -------------------------------
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mcompany: z.string().optional(),
  companyId: z.number().int().positive().optional(),
});

// ------------------ Routes -------------------------------

// Create contact
router.post(
  '/',
  validate(contactSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = (req as any).validated as z.infer<typeof contactSchema>;
      const { companyId, ...rest } = body;
      const data: any = { ...rest };
      if (typeof companyId === 'number' && companyId > 0) data.companyId = companyId;

      const contact = await prisma.contact.create({ data });
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }
);

// List contacts (optional filter by companyId)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.query;
    const where =
      companyId && !Array.isArray(companyId)
        ? { companyId: Number(companyId) }
        : {};
    const contacts = await prisma.contact.findMany({ where });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

// Get single contact
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      return res.status(404).json({ status: 404, message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

// Update contact
router.put(
  '/:id',
  validate(contactSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const body = (req as any).validated as Partial<
        z.infer<typeof contactSchema>
      >;
      const { companyId, ...rest } = body;
      const data: any = { ...rest };
      if (typeof companyId === 'number' && companyId > 0) data.companyId = companyId;

      const contact = await prisma.contact.update({ where: { id }, data });
      res.json(contact);
    } catch (err) {
      next(err);
    }
  }
);

// Delete contact
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.contact.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// nested activities
router.use('/:contactId/activities', activityRouter);

export default router;